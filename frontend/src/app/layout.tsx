import Navbar from "@/components/ui/navbar";
import "../styles/globals.css"; // Ensure Tailwind is working

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white rounded">
        <Navbar />
        <main className=" bg-gray-800 rounded-lg shadow-md m-1 ">
          {children}
        </main>
      </body>
    </html>
  );
}
