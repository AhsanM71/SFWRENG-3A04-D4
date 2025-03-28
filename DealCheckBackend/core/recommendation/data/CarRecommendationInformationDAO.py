from CarRecommendationInformation import CarRecommendationInformation
from db import getCollectionRef, createDocument, getQueryResults, updateDocument, deleteDocument, getDocument
from db import CAR_RECOMMENDATION_COLLECTION, AsyncCollectionReference, FieldFilter, AsyncQuery

class CarRecommendationInformationDAO:
    async def getCarRecommendationInformation(id: str) -> CarRecommendationInformation:
        '''
        Gets the information of a car recommendation information document from the database

        Args:
            id (str): The id of the car recommendation information document

        Returns:
            CarRecommendationInformation: The car recommendation information instance with the data of the document
        '''

        if not id:
            raise Exception('Missing document id!')
        
        # Get data from firestore database
        data: dict = await getDocument(collection=CAR_RECOMMENDATION_COLLECTION, id=id)
        return CarRecommendationInformation.from_dict(data=data)

    async def getUserCarRecommendationInformation(userId: str) -> list[CarRecommendationInformation]:
        '''
        Get the user car recommendation information documents from the database

        Args:
            userId (str): The id of the user to get the car recommendation information for

        Returns:
            list[CarRecommendationInformation]: The list of car recommendation information for the user
        '''

        if not userId:
            raise Exception('Missing user ID!')

        collectionRef: AsyncCollectionReference = getCollectionRef(collection=CAR_RECOMMENDATION_COLLECTION)
        query: AsyncQuery = collectionRef.where(filter=FieldFilter('userId', '==', userId))

        # Get query results and convert them to CarRecommendationInformationObjects
        documents: list[dict] = await getQueryResults(query)
        return map(CarRecommendationInformation.from_dict, documents)

    async def updateCarRecommendationInformation(carRecommendation: CarRecommendationInformation) -> CarRecommendationInformation:
        '''
        Updates the car recommendation information document in the database

        Args:
            carRecommendation (CarRecommendationInformation): The car recommendation information instance containing the new data and document id

        Returns:
            CarRecommendationInformation: The updated car recommendation information instance
        '''

        if not carRecommendation:
            raise Exception('Missing car recommendation information!')

        id: str = carRecommendation.getId()
        data: dict = carRecommendation.to_dict()

        # Send request to update the document in firestore database
        updateData: dict = await updateDocument(collection=CAR_RECOMMENDATION_COLLECTION, id=id, data=data)
        return CarRecommendationInformation.from_dict(updateData)

    async def deleteCarRecommendationInformation(id: str) -> bool:
        '''
        Deletes a car recommendation information document from the database

        Args:
            id (str): The id of the document to delete

        Returns:
            bool: True once the document is deleted
        '''

        if not id:
            raise Exception('Car recommendation information id document missing!')
        
        await deleteDocument(CAR_RECOMMENDATION_COLLECTION, id=id)
        return True

    async def addCarRecommendationInformation(carRecommendation: CarRecommendationInformation) -> CarRecommendationInformation:
        '''
        Adds a car recommendation information document to the database

        Args:
            carRecommendation (CarRecommendationInformation): The car recommendation information instance containing the data of the document to create

        Returns:
            CarRecommendationInformation: The instance created in the database, with the document id
        '''

        if not carRecommendation:
            raise Exception('Missing car recommendation information!')
        
        # Add the document in firestore database
        data: dict = carRecommendation.to_dict()
        carRecommendationData: dict = await createDocument(CAR_RECOMMENDATION_COLLECTION, data)

        return CarRecommendationInformation.from_dict(carRecommendationData)

INSTANCE: CarRecommendationInformationDAO = CarRecommendationInformationDAO()

