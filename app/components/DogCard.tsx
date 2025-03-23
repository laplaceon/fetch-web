import { Card, CardHeader, CardBody } from "@heroui/react";

const DogCard = ({ dog }) => {
    return (
        <Card key={dog.id} className="w-full">
            {/* If Card supports a header image, you can do something like Card.HeaderImage */}
            <img 
                src={dog.img}
                alt={dog.name}
                className="w-full h-auto object-cover"
            />
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

export default DogCard;