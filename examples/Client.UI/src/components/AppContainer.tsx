import { AppBar, Container, Toolbar, Box  } from "@mui/material"
import { Outlet } from "react-router-dom"
import AuthForm from "./AuthForm"

const Header = () => {
  return (
    <AppBar color='transparent' position="static">
        <Toolbar>
        <Box>
          <AuthForm />
          </Box>
      </Toolbar>
    </AppBar>
  )
}

const AppContainer = () => {
  return (
    <>
      <Header />
      <Container>
        <Box sx={{mt: 5}}>
          <Outlet />
        </Box>
      </Container>
    </>
  )
}

export default AppContainer