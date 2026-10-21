import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getProducts, INITIAL_PRODUCTS } from "@/lib/products";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — Siera Pearl",
    };
  }

  return {
    title: `${product.name} — Siera Pearl`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Siera Pearl`,
      description: product.description,
      images: product.photos.length > 0 ? [product.photos[0]] : ["/assets/images/logo.webp"],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => p.cat === product.cat && p.id !== product.id)
    .slice(0, 3);

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.cat,
    image: product.photos.length > 0 ? product.photos[0] : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: 18,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={related}
        allProducts={allProducts}
      />
    </>
  );
}
