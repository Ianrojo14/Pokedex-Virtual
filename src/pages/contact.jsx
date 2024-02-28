import Header from "../components/header";
import img1 from "../assets/images/contact/img-1.jpg";

import { Input, Textarea } from "@nextui-org/react";

function Contact() {
    return (
        <>
            <Header/>
            <main className="h-screen w-full">
                <section className="h-full w-full p-10 bg-red-200"> {/* Cambiado a bg-blue-200 para un azul desvanecido */}
                    <div className="w-full p-5 bg-orange-200 rounded-lg flex gap-10 justify-evenly items-center"> {/* Cambiado a bg-yellow-200 para un amarillo desvanecido */}
                        <div className="w-1/2 space-y-10 text-white">
                            <h1 className="text-5xl font-bold">Contacto</h1>
                            <div className=" space-y-5">
                                <Input
                                    isRequired
                                    type="text"
                                    label="Nombre"
                                    defaultValue="Ingrese su nombre"
                                    className="max-w-xs"
                                />
                                <Input
                                    isRequired
                                    type="email"
                                    label="Email"
                                    defaultValue="Ingrese su email"
                                    className="max-w-xs"
                                />
                                <Textarea
                                    isRequired
                                    label="Mensaje"
                                    labelPlacement="inside"
                                    placeholder="Ingrese su mensaje"
                                    className="max-w-xs"
                                />
                            </div>
                        </div>
                        <div className="h-1/2 w-2/5">
                            <img className="object-cover" src={img1} alt="" />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Contact;
