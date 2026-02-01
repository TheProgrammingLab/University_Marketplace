export function filterPostMedia(postMedias, postId) {
  const filteredMedias = postMedias.filter(media => {
    return media.post_id === postId;
  });

  return filteredMedias;
}
export function filterListingImages(listingImages, listingId) {
  const filtereImages = listingImages.filter(img => {
    return img.listing_id === listingId;
  });

  return filtereImages;
}
