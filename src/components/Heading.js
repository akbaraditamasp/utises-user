import Container from "./Container";

export default function Heading({ children }) {
  return (
    <div className="h-32 bg-primary-tint flex justify-center border-t border-b border-primary-base">
      <Container className="flex flex-col justify-center items-center">
        {children}
      </Container>
    </div>
  );
}
