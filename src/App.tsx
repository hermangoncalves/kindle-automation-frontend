import { Toaster } from "./components/ui/toaster"
import { RouterProvider } from "react-router-dom"
import { router } from "./routes"
import { ThemeProvider } from "./components/theme-provider"
import "./index.css"

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </>
  )
}

export default App
