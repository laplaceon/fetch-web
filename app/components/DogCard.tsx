import { Button, Card, CardHeader, CardBody } from "@heroui/react";
import { StarIcon, StarOffIcon } from "lucide-react";

export const DogCard = ({ dog, isFavorite, toggleFavorite }) => {
    return (
        <Card key={dog.id} className="w-full">
            {/* If Card supports a header image, you can do something like Card.HeaderImage */}
            <img 
                src={dog.img}
                alt={dog.name}
                className="w-full h-auto object-cover"
            />
            <Button isIconOnly aria-label="Like" color="danger" onPress={() => {toggleFavorite(dog.id)}}>
                {isFavorite ? <StarOffIcon /> : <StarIcon />}
            </Button>
            <CardHeader>
                <h3 className="font-semibold text-lg">{dog.name}</h3>
                <p className="text-default-500">{dog.breed}</p>
            </CardHeader>
            <CardBody>
                <p>
                <strong>Age:</strong> {dog.age}
                </p>
                <p>
                <strong>Zip Code:</strong> {dog.zip_code}
                </p>
            </CardBody>
        </Card>
    )
}