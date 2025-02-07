export function FixedCenterLayout({
  children,
  title
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <main>
      <div className="children-container">{children}</div>
      <style jsx>{`
        html {
          background: none;
        }
        .children-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </main>
  );
}
