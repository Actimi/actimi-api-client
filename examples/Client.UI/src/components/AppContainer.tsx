import { AppBar, Container, Toolbar, Box  } from "@mui/material"
import { Outlet } from "react-router-dom"

const Header = () => {
  return (
    <AppBar color='transparent' position="static">
        <Toolbar>
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