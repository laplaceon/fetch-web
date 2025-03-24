import { Navbar, NavbarBrand, NavbarItem, NavbarContent, Button } from "@heroui/react"


export const NavHeader = ({ user, handleLogout }) => {
    return (
        <Navbar>
            <NavbarBrand>
            {/* <AcmeLogo /> */}
            <p className="font-bold text-inherit">Fetch</p>
            </NavbarBrand>
            <NavbarContent justify="end">
            {user ? 
            <NavbarItem>
                <Button onPress={handleLogout}>Log out</Button>
            </NavbarItem> : ""
            }
            </NavbarContent>
        </Navbar>
    )
}
