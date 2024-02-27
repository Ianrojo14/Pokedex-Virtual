import { Link } from "react-router-dom";
import Header from "../components/header";
import {Accordion, AccordionItem} from "@nextui-org/react";


function Creator() {
  return (
    <>
        <Header/>

        <main className="bg-black">
            <section className="container mx-auto p-4 h-screen">
                <div className="p-5 flex-col justify-center items-center bg-gray-600 rounded-sm h-full">
                    <h1 className="text-3xl font-bold text-center text-white">Creador</h1>
                    <div>
                        <a href="https://github.com/Ianrojo14">
                        <img src="https://avatars.githubusercontent.com/u/144838820?s=400&v=4" 
                        alt="Creador" className="mx-auto rounded-full w-40 h-40" />
                        </a>
                    </div>
                    <Accordion>
                <AccordionItem key="1" aria-label="Accordion 1" title="Nombre">
                    <p>Ian Carlos Chavez Rojo</p>
                </AccordionItem>
                <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
                    <p>Contenido 2</p>
                </AccordionItem>
                <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
                </AccordionItem>
                </Accordion>
                </div>
            </section>
        </main>

    </>
  );
}

export default Creator;