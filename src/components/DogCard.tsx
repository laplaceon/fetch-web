import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { StarIcon, StarOffIcon } from "lucide-react";

import { Dog } from "@/types";

export const DogCard = ({ dog, isFavorite, toggleFavorite }: { dog: Dog, isFavorite: boolean, toggleFavorite: (dog: Dog) => void }) => {
    return (
        <Card key={dog.id} className="w-full overflow-hidden shadow-lg relative">

            <div className="relative w-full h-64">
                <img 
                    src={dog.img}
                    alt={dog.name}
                    className="w-full h-full object-cover"
                />

                <Button 
                    isIconOnly 
                    aria-label="Like" 
                    color="danger" 
                    className="absolute top-2 left-2 bg-white/70 rounded-full p-2 hover:bg-white"
                    onPress={() => toggleFavorite(dog)}
                >
                    {isFavorite ? <StarOffIcon className="text-red-500" /> : <StarIcon className="text-gray-700" />}
                </Button>
            </div>

            <CardHeader className="px-4 pt-4">
                <h3 className="font-semibold text-lg">{dog.name}</h3>
                <p className="ml-2 text-gray-500">{dog.breed}</p>
            </CardHeader>

            <CardBody className="px-4 pb-4">
                <p><strong>Age:</strong> {dog.age}</p>
                <p><strong>Zip Code:</strong> {dog.zip_code}</p>
            </CardBody>
        </Card>
    )
}