import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
      "Inicio",
      "Pokedex",
      "Contacto",
      "Creador",
    ];
  
    return (
      <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-red-600 text-white">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <p className="font-bold text-inherit uppercase">Pokedex Virtual</p>
          </NavbarBrand>
        </NavbarContent>
  
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link className="text-white" href="/">
              Inicio
            </Link>
          </NavbarItem>
          <NavbarItem >
            <Link className="text-white" href="/pokedex" >
              Pokedex
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-white" href="/contact">
              Contacto
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-white" href="/creator">
              Creador
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    );

}

export default Header;