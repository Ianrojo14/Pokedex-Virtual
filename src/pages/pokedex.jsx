import "../assets/styles/styles.css"
import Header from "../components/header";
import { Divider, Input } from "@nextui-org/react";

import { IoSearch } from "react-icons/io5";
import Pokemons from "../components/pokemons";



function Pokedex() {

    return (
        <>
            <Header/>

            <main>
                <section id="hero-pokedex" className="h-96">
                    <div className="bg-black/50 h-full flex flex-col justify-center items-center text-white">
                        <h1 className="text-4xl font-bold">Pokedex</h1>
                        <p className="text-2xl">Busca tus pokemones favoritos </p>
                    </div>
                </section>

                <section>
                    <Pokemons/>
                </section>
            </main>
        </>
    )
}

export default Pokedex;