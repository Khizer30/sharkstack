export function isVideoActivity(activity) {
  const url = activity?.mediaURL ?? "";
  return /\/video\/upload\//.test(url) || /\.(mp4|webm|mov|m4v)$/i.test(url);
}

export function normalizeActivity(activity) {
  return {
    id: activity.id,
    src: activity.mediaURL,
    name: "SharkStack team activity"
  };
}

export function normalizeActivityAsHeroImage(activity) {
  return {
    id: activity.id,
    image: activity.mediaURL,
    alt: "SharkStack team activity"
  };
}

export function normalizeActivityAsGalleryImage(activity) {
  return {
    id: activity.id,
    src: activity.mediaURL,
    alt: "SharkStack team activity"
  };
}

export function shuffle(array) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
