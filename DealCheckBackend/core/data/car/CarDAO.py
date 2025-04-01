from core.data.car.Car import Car
from db import createDocument, getDocument, deleteDocument, updateDocument, CARS_COLLECTION

class CarDAO:
    async def addCar(car: Car) -> Car:
        '''
        Adds a car document to the firestore database

        Args:
            car (Car): The car instance with the information to add to firestore

        Returns:
            Car: The car instance with all the car data (including the id)
        '''

        if not car:
            raise Exception('Missing car information!')
        
        # Create document in firebase
        carData: dict = car.to_dict()
        
        data: dict = await createDocument(CARS_COLLECTION, carData)
        return Car.from_dict(data)

    async def getCar(id: str) -> Car:
        '''
        Gets car data from the firestore database

        Args:
            id (str): The id of the car instance to get from firebase

        Returns:
            Car: The car instance containing the car data
        '''

        if not id:
            raise Exception('Car id is a required field!')
        
        # Get Car Data from firestore database
        data: dict = await getDocument(CARS_COLLECTION, id=id)
        return Car.from_dict(data)

    async def deleteCar(id: str) -> bool:
        '''
        Delete a car from the firestore database
        '''

        if not id:
            raise Exception('Car id is a required field!')
        
        # Delete Car document from firestore
        await deleteDocument(CARS_COLLECTION, id=id)
        return True

    async def updateCar(car: Car) -> Car:
        '''
        Updates a car document in the firestore database

        Args:
            car (Car): The car document to update

        Returns:
            Car: The car instance with the updated data
        '''

        if not car:
            raise Exception('Missing car information!')
        
        # Update document in firestore database
        updatedData: dict = car.to_dict()
        data: dict = await updateDocument(CARS_COLLECTION, car.getId(), updatedData)

        return Car.from_dict(data)
