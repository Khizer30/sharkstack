import AnimatedNavLink from "./AnimatedNavLink";

export default function NavLinks({ links }) {
  return (
    <nav className="hidden lg:flex items-center gap-6">
      {links.map((link) => (
        <AnimatedNavLink key={link.to} to={link.to}>
          {link.label}
        </AnimatedNavLink>
      ))}
    </nav>
  );
}
