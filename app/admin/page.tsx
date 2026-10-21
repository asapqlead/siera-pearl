"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Upload,
  AlertCircle,
  Loader2,
  ArrowLeft,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product, ProductCategory, MetalType, PearlType, ProductBadge } from "@/types/product";
import { formatMoney, mapDbProduct, INITIAL_PRODUCTS } from "@/lib/products";
import { getProductPhotos } from "@/lib/images";
import { useToast } from "@/context/ToastContext";

const CATEGORIES: ProductCategory[] = ["Necklaces", "Earrings", "Bracelets", "Rings", "Bridal"];
const PEARL_TYPES: PearlType[] = ["Akoya", "South Sea", "Tahitian", "Freshwater", "Keshi"];
const METALS: MetalType[] = ["Yellow Gold", "Rose Gold", "White Gold"];
const BADGES: string[] = ["None", "Bestseller", "Sale", "New"];

export default function AdminPage() {
  const { showToast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [, setLoadingProducts] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form state for Add/Edit
  const [formState, setFormState] = useState<{
    slug: string;
    cat: ProductCategory;
    name: string;
    metal: MetalType;
    pearl: PearlType;
    price: number;
    was: string;
    description: string;
    badge: ProductBadge;
    rating: number;
    in_stock: boolean;
    stock_qty: number;
    photos: string[];
  }>({
    slug: "",
    cat: "Necklaces",
    name: "",
    metal: "Yellow Gold",
    pearl: "Akoya",
    price: 500,
    was: "",
    description: "",
    badge: null,
    rating: 5,
    in_stock: true,
    stock_qty: 10,
    photos: [],
  });

  // Check auth session
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (err) {
        console.warn("Auth check failed:", err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch products
  const fetchAdminProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error || !data || data.length === 0) {
        setProducts(INITIAL_PRODUCTS);
      } else {
        setProducts(data.map(mapDbProduct));
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setSession(data.session);
        showToast("Signed in as stock controller");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    showToast("Signed out successfully");
  };

  // Toggle in_stock inline
  const handleToggleStock = async (product: Product) => {
    const nextVal = !product.in_stock;
    const nextQty = nextVal ? Math.max(1, product.stock_qty) : 0;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, in_stock: nextVal, stock_qty: nextQty } : p))
    );

    try {
      const { error } = await supabase
        .from("products")
        .update({ in_stock: nextVal, stock_qty: nextQty })
        .eq("id", product.id);

      if (error) {
        showToast("Could not update in Supabase (check admin permissions)");
        fetchAdminProducts();
      } else {
        showToast(`${product.name} marked as ${nextVal ? "In Stock" : "Out of Stock"}`);
      }
    } catch (err) {
      console.error("Stock toggle error:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to permanently delete "${product.name}"?`)) return;

    setProducts((prev) => prev.filter((p) => p.id !== product.id));

    try {
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) {
        showToast("Failed to delete (requires authenticated stock controller)");
        fetchAdminProducts();
      } else {
        showToast(`Deleted ${product.name}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Photo upload to Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    const file = files[0];
    const slug = formState.slug || "new-item";
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = `${slug}/${cleanFileName}`;

    try {
      const { error } = await supabase.storage
        .from("product-photos")
        .upload(filePath, file, { upsert: true });

      if (error) {
        showToast(`Upload failed: ${error.message}`);
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from("product-photos").getPublicUrl(filePath);

        setFormState((prev) => ({
          ...prev,
          photos: [...prev.photos, publicUrl],
        }));
        showToast("Photo uploaded to Supabase Storage");
      }
    } catch (err: any) {
      showToast(`Upload error: ${err.message || err}`);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  // Open Edit Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormState({
      slug: p.slug,
      cat: p.cat,
      name: p.name,
      metal: p.metal,
      pearl: p.pearl,
      price: p.price,
      was: p.was ? String(p.was) : "",
      description: p.description,
      badge: p.badge || null,
      rating: p.rating,
      in_stock: p.in_stock,
      stock_qty: p.stock_qty,
      photos: [...p.photos],
    });
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormState({
      slug: `00-piece-${Date.now().toString().slice(-4)}`,
      cat: "Necklaces",
      name: "",
      metal: "Yellow Gold",
      pearl: "Akoya",
      price: 650,
      was: "",
      description: "",
      badge: null,
      rating: 5,
      in_stock: true,
      stock_qty: 12,
      photos: [],
    });
    setIsAddOpen(true);
  };

  // Save Add/Edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      alert("Product name is required");
      return;
    }

    const payload = {
      slug: formState.slug.trim(),
      cat: formState.cat,
      name: formState.name.trim(),
      metal: formState.metal,
      pearl: formState.pearl,
      price: Number(formState.price),
      was: formState.was ? Number(formState.was) : null,
      description: formState.description.trim(),
      badge: formState.badge || null,
      rating: Number(formState.rating),
      in_stock: formState.in_stock,
      stock_qty: Number(formState.stock_qty),
      photos: formState.photos,
    };

    if (editingProduct) {
      // Update
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p))
      );
      setEditingProduct(null);

      try {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id);

        if (error) {
          showToast(`Save error: ${error.message}`);
          fetchAdminProducts();
        } else {
          showToast(`Updated "${payload.name}" successfully`);
        }
      } catch (err: any) {
        showToast(`Update error: ${err.message}`);
      }
    } else {
      // Insert
      setIsAddOpen(false);
      try {
        const { error } = await supabase
          .from("products")
          .insert([payload])
          .select();

        if (error) {
          showToast(`Insert failed: ${error.message}`);
        } else {
          showToast(`Created new piece "${payload.name}"`);
          fetchAdminProducts();
        }
      } catch (err: any) {
        showToast(`Insert error: ${err.message}`);
      }
    }
  };

  // Filtered admin products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCat !== "all" && p.cat !== selectedCat) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(s) ||
          p.slug.toLowerCase().includes(s) ||
          p.pearl.toLowerCase().includes(s) ||
          p.metal.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [products, selectedCat, search]);

  // Inventory metrics
  const totalStockQty = products.reduce((sum, p) => sum + (p.stock_qty || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * (p.stock_qty || 1), 0);
  const outOfStockCount = products.filter((p) => !p.in_stock || p.stock_qty === 0).length;

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFAF6]">
        <Loader2 className="w-8 h-8 text-[#B78A45] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1E8] text-[#1E2420]">
      {/* Top Navbar */}
      <header className="bg-[#1E2420] text-[#FBFAF6] px-6 py-4 flex items-center justify-between shadow-md border-b border-[#0E3B2E]">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#D9B677] hover:text-white uppercase tracking-wider font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Boutique
          </Link>
          <span className="text-[#4A534C]">|</span>
          <div className="font-serif text-lg tracking-widest font-medium text-[#FBFAF6]">
            SIERA PEARL <span className="text-xs uppercase font-sans text-[#D9B677]">Stock Controller</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#B9C7BC] hidden sm:inline">{session.user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-[#A5433A]/20 hover:bg-[#A5433A] text-[#FBFAF6] px-3.5 py-1.5 rounded-lg font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <span className="text-xs text-[#D9B677] bg-[#B78A45]/20 px-3 py-1 rounded-full font-semibold">
              Preview Mode (Sign in below to edit)
            </span>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* If not logged in: show login card */}
        {!session && (
          <div className="bg-[#FBFAF6] border border-[#E4E0D3] rounded-2xl p-6 sm:p-8 shadow-lg max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#0E3B2E]/10 flex items-center justify-center text-[#0E3B2E] mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#1E2420]">Staff Authentication</h2>
              <p className="text-xs text-[#4A534C]">
                Sign in with your authorized stock controller credentials from your Supabase project.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                  Staff Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sierapearl.com"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  required
                />
              </div>

              {authError && (
                <div className="p-3 bg-[#A5433A]/10 border border-[#A5433A]/30 rounded-lg text-xs text-[#A5433A] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-[#0E3B2E] hover:bg-[#092A20] text-[#FBFAF6] py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
              >
                {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>{isLoggingIn ? "Verifying Credentials…" : "Sign In to Manage Inventory"}</span>
              </button>
            </form>
          </div>
        )}

        {/* METRICS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FBFAF6] p-6 rounded-2xl border border-[#E4E0D3] shadow-sm space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#4A534C] font-semibold">
              Catalog SKUs
            </span>
            <div className="font-serif text-3xl font-bold text-[#1E2420]">{products.length}</div>
            <p className="text-[11px] text-[#8C6A2F]">Across 5 jewelry categories</p>
          </div>

          <div className="bg-[#FBFAF6] p-6 rounded-2xl border border-[#E4E0D3] shadow-sm space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#4A534C] font-semibold">
              Total Units In Vault
            </span>
            <div className="font-serif text-3xl font-bold text-[#0E3B2E]">{totalStockQty}</div>
            <p className="text-[11px] text-[#0E3B2E]">Ready for immediate courier</p>
          </div>

          <div className="bg-[#FBFAF6] p-6 rounded-2xl border border-[#E4E0D3] shadow-sm space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#4A534C] font-semibold">
              Out of Stock / Depleted
            </span>
            <div className="font-serif text-3xl font-bold text-[#A5433A]">{outOfStockCount}</div>
            <p className="text-[11px] text-[#A5433A]">Require atelier restocking</p>
          </div>

          <div className="bg-[#FBFAF6] p-6 rounded-2xl border border-[#E4E0D3] shadow-sm space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#4A534C] font-semibold">
              Total Vault Valuation
            </span>
            <div className="font-serif text-3xl font-bold text-[#8C6A2F]">{formatMoney(totalValue)}</div>
            <p className="text-[11px] text-[#4A534C]">Retail appraisal basis</p>
          </div>
        </div>

        {/* PRODUCTS MANAGEMENT TABLE */}
        <div className="bg-[#FBFAF6] rounded-2xl border border-[#E4E0D3] shadow-md overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-[#E4E0D3] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by name, slug, pearl, metal..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                />
                <Search className="w-4 h-4 text-[#4A534C] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="bg-white border border-[#E4E0D3] text-xs font-semibold rounded-lg px-3 py-2 cursor-pointer focus:outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-[#0E3B2E] hover:bg-[#092A20] text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Piece
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F1E8] border-b border-[#E4E0D3] text-[#4A534C] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Piece</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Metal &amp; Pearl</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Qty</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E0D3]">
                {filteredProducts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-[#F4F1E8]/50 transition-colors">
                      {/* Product Name & Thumb */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-[2px] bg-[#F4F1E8] border border-[#E4E0D3] overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                            <Image
                              src={p.photos?.[0] || getProductPhotos(p).primary}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-serif text-sm font-semibold text-[#1E2420]">{p.name}</div>
                            <div className="text-[11px] text-[#4A534C] font-mono">{p.slug}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-medium text-[#1E2420]">{p.cat}</td>

                      {/* Metal & Pearl */}
                      <td className="py-3 px-4">
                        <div className="text-[#1E2420] font-medium">{p.pearl} Pearl</div>
                        <div className="text-[11px] text-[#8C6A2F]">{p.metal}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-serif text-sm font-bold text-[#1E2420]">{formatMoney(p.price)}</div>
                        {p.was && <div className="text-[11px] text-[#4A534C] line-through">{formatMoney(p.was)}</div>}
                      </td>

                      {/* Stock Qty */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-semibold text-[#1E2420]">{p.stock_qty}</span> units
                      </td>

                      {/* Status & Quick Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                            p.in_stock
                              ? "bg-[#E7EEE7] text-[#0E3B2E] hover:bg-[#A5433A]/10 hover:text-[#A5433A]"
                              : "bg-[#A5433A]/10 text-[#A5433A] hover:bg-[#E7EEE7] hover:text-[#0E3B2E]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.in_stock ? "bg-[#0E3B2E]" : "bg-[#A5433A]"
                            }`}
                          />
                          {p.in_stock ? "In Stock" : "Out of Stock"}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#4A534C] hover:text-[#0E3B2E] transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-[#4A534C] hover:text-[#B78A45] transition-colors"
                            title="Edit Piece"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 text-[#4A534C] hover:text-[#A5433A] transition-colors"
                            title="Delete Piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ADD / EDIT MODAL */}
      {(isAddOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#092A20]/60 backdrop-blur-sm"
            onClick={() => {
              setIsAddOpen(false);
              setEditingProduct(null);
            }}
          />

          <div className="relative w-full max-w-2xl bg-[#FBFAF6] rounded-2xl shadow-2xl border border-[#E4E0D3] overflow-hidden z-10 max-h-[90vh] flex flex-col animate-modal-in">
            <div className="flex items-center justify-between p-6 border-b border-[#E4E0D3]">
              <h3 className="font-serif text-xl font-medium text-[#1E2420]">
                {editingProduct ? `Edit Piece: ${editingProduct.name}` : "Add New Jewelry Piece"}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-[#4A534C] hover:text-[#1E2420]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Piece Name
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. South Sea Pavé Pendant"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formState.slug}
                    onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                    placeholder="31-south-sea-pendant"
                    className="w-full px-4 py-2.5 text-sm font-mono bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Category
                  </label>
                  <select
                    value={formState.cat}
                    onChange={(e) => setFormState({ ...formState, cat: e.target.value as ProductCategory })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Pearl Variety
                  </label>
                  <select
                    value={formState.pearl}
                    onChange={(e) => setFormState({ ...formState, pearl: e.target.value as PearlType })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  >
                    {PEARL_TYPES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Precious Metal
                  </label>
                  <select
                    value={formState.metal}
                    onChange={(e) => setFormState({ ...formState, metal: e.target.value as MetalType })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  >
                    {METALS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Price ($ USD)
                  </label>
                  <input
                    type="number"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Original Price (Optional Was $)
                  </label>
                  <input
                    type="number"
                    value={formState.was}
                    onChange={(e) => setFormState({ ...formState, was: e.target.value })}
                    placeholder="Leave empty if not on sale"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formState.stock_qty}
                    onChange={(e) => setFormState({ ...formState, stock_qty: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Curated Badge
                  </label>
                  <select
                    value={formState.badge || "None"}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        badge: e.target.value === "None" ? null : (e.target.value as ProductBadge),
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  >
                    {BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420] mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    value={formState.description}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    placeholder="Describe nacre quality, clasp mechanism, and styling advice..."
                    className="w-full px-4 py-2.5 text-sm bg-white border border-[#E4E0D3] rounded-lg focus:outline-none focus:border-[#B78A45]"
                  />
                </div>

                {/* Upload Photo to Supabase Storage */}
                <div className="sm:col-span-2 border-t border-[#E4E0D3] pt-4 space-y-3">
                  <label className="block font-semibold uppercase tracking-wider text-[#1E2420]">
                    Upload Product Photos to Supabase Storage (product-photos bucket)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 bg-[#F4F1E8] hover:bg-[#E4E0D3] border border-[#E4E0D3] px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                      {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{uploadingPhoto ? "Uploading to Bucket…" : "Choose Photo File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-[#4A534C]">
                      {formState.photos.length} photo(s) attached
                    </span>
                  </div>

                  {formState.photos.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pt-2">
                      {formState.photos.map((url, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-lg bg-white border overflow-hidden group">
                          <Image src={url} alt={`Photo ${i + 1}`} fill sizes="64px" className="object-cover" />
                          <button
                            type="button"
                            onClick={() =>
                              setFormState({
                                ...formState,
                                photos: formState.photos.filter((_, idx) => idx !== i),
                              })
                            }
                            className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-[#A5433A]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[#E4E0D3] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold text-[#4A534C] hover:bg-[#E4E0D3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0E3B2E] hover:bg-[#092A20] text-white px-7 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider shadow"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
