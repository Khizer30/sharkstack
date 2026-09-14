export function normalizeTestimonial(testimonial) {
  return {
    id: testimonial.id,
    name: testimonial.clientName,
    company: testimonial.company,
    avatar: testimonial.clientImageURL,
    rating: 5,
    text: testimonial.review
  };
}

export function normalizeTeamMember(member) {
  return {
    id: member.id,
    name: member.name,
    avatar: member.profileImage,
    text: member.review
  };
}
