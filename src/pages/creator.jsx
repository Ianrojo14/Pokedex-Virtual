import { Link } from "react-router-dom";
import Header from "../components/header";
import {Accordion, AccordionItem} from "@nextui-org/react";
import pika from "../assets/images/creador/pika.gif";

function Creator() {
  return (
    <>
        <Header/>

        <main className="bg-black">
            <section className="container mx-auto p-4 h-screen">
                <div className="p-5 flex-col justify-center items-center bg-gray-600 rounded-sm h-full">
                    
                    <div>
                        <a href="https://github.com/Ianrojo14">
                        <img src="https://avatars.githubusercontent.com/u/144838820?s=400&v=4" 
                        alt="Creador" className="mx-auto rounded-full w-40 h-40" />
                        </a>
                        <h1 className="text-3xl font-bold text-center text-white">Creador</h1>
                    </div>
                    <Accordion>
                <AccordionItem key="1" aria-label="Accordion 1" title={<span style={{ color: "#f3d8c7" }}>Nombre</span>}>
                    <p className="text-white">Ian Carlos Chavez Rojo</p>
                </AccordionItem>
                <AccordionItem key="2" aria-label="Accordion 2" title={<span style={{ color: "#f3d8c7" }}>Grupo</span>}>
                    <p className="text-white">TID42M</p>
                </AccordionItem>
                <AccordionItem key="3" aria-label="Accordion 3" title={<span style={{ color: "#f3d8c7" }}>Matricula</span>}>
                    <p className="text-white">1122150023</p>
                </AccordionItem>
                <AccordionItem key="4" aria-label="Accordion 4" title={<span style={{ color: "#f3d8c7" }}>Correo</span>}>
                    <p className="text-white">a1122150023@utch.edu.mx</p>
                </AccordionItem>
                </Accordion>
                <img src={pika } alt="pika" className="mx-auto w-100 h-100 " />

                </div>
                </section>
            
            
        </main>

    </>
  );
}

export default Creator;