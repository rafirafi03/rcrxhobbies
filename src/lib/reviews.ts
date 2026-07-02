import { getReviewsForProductSlug, getPublishedReviews } from "./sanity/queries";

export async function loadProductReviews(productId: string) {
  return getReviewsForProductSlug(productId);
}

export async function loadHomeReviews() {
  return getPublishedReviews(12);
}
