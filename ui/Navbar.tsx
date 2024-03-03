'use client';

import {Link} from "@nextui-org/link";
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@nextui-org/dropdown";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation'
import GoogleLogo from "./assets/google-mark.png"
import Image from "next/image"
import styles from "../styles/navbar.module.css"

export default function Nav() {  
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const profIsCurrPage = pathname.includes("/profile/")
  const homeIsCurrPage = pathname === "/"

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit">NAME</p>
      </NavbarBrand>

      <NavbarContent className="sm:flex gap-4" justify="center">
          <NavbarItem isActive={homeIsCurrPage}>
            <Link href="/" color={homeIsCurrPage ? "primary" : "foreground"}>
              Home
            </Link>
          </NavbarItem>

          <NavbarItem isActive={profIsCurrPage}>
            {session && (
              <Link href={`/profile/${session?.user?.id}` || "/"} aria-current="page" color={profIsCurrPage ? "primary" : "foreground"}>
                Profile
              </Link>
            )}
          </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Image
              className="h-8 w-8 rounded-full"
              src={session?.user?.image || 'https://avatar.vercel.sh/leerob'}
              height={32}
              width={32}
              alt={`${session?.user?.name || 'placeholder'} avatar`}
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">

            {session ? (
              <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
                <button>
                  Log Out
                </button>
              </DropdownItem>
            ) : (
              <DropdownItem key="google-login" onClick={() => signIn('google')}>
                <button className={styles.loginBtn}>
                  Sign In With:
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={GoogleLogo}
                    height={32}
                    width={32}
                    alt={`GoogleLogo`}
                  />
                </button>
              </DropdownItem>
            )}
            
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}