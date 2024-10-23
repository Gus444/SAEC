import { UserProvider } from './context/userContext'  //contexto de usuario
import { EmpProvider } from "./context/empContext";
export const metadata = {
  title: 'Escritório Primus',
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
          {/* fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
          <link href="https://fonts.googleapis.com/css2?family=Jacquard+24&family=Jacquard+24+Charted&family=Jersey+25+Charted&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet"/>
        </head>
        <body>
          {children}
        </body>
      </html>
      </EmpProvider>
    </UserProvider>
  )
}
