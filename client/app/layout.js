import localFont from "next/font/local";
//import "./globals.css";
//import "../public/template/css/sb-admin-2.css" //css do template

import { UserProvider } from './context/userContext'  //contexto de usuario
import { EmpProvider } from "./context/empContext";
export const metadata = {
  title: 'Home',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <EmpProvider>
      <html lang="pt-BR">
        <head>
          <link rel="stylesheet" href="/template/css/login.css"></link>
          <link rel="stylesheet" href="/template/css/layoutIndex.css"></link>

          {/* icons */}
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>
          {/* css form */}
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"></link>
        </head>
        <body>
          {children}
        </body>
      </html>
      </EmpProvider>
    </UserProvider>
  )
}
