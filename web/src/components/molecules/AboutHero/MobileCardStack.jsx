import StackCard from "@/components/atoms/StackCard";

export default function MobileCardStack({ images }) {
  return (
    <div className="relative md:hidden">
      {images.map((image, i) => (
        <StackCard key={image.id} image={image} zIndex={i + 1} />
      ))}
    </div>
  );
}
