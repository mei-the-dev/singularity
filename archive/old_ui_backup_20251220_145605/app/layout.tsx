import "./globals.css";
export default function Root({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <div className="black-hole-container">
            <div className="accretion-disk"></div>
            <div className="singularity"></div>
        </div>
        {children}
      </body>
    </html>
  );
}