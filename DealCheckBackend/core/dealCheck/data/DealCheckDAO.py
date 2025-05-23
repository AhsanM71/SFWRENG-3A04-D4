from core.dealCheck.data.DealCheckData import DealCheckData
from db import getCollectionRef, createDocument, getQueryResults, updateDocument, deleteDocument, getDocument
from db import CAR_DEALCHECK_FEATURE, CollectionReference, FieldFilter, Query

class DealCheckDAO:
    def getDealCheckData(self, id: str) -> DealCheckData:
        '''
        Gets the information of a car deal check valuation data document from the database
        
        Args:
            id (str): The id of the car deal check valuation data document
        
        Returns:
            DealCheckData: The car deal check valuation data instance with the data of the document
        '''
        
        if not id:
            raise Exception('Missing document id!')

        # Get data from firestore database
        data: dict = getDocument(collection=CAR_DEALCHECK_FEATURE, id=id)
        return DealCheckData.from_dict(data=data)
    
    def getUserDealCheckData(self, userId: str) -> list[DealCheckData]:
        '''
        Get user car deal check valuation data documents from the database
        
        Args:
            userId (str): The id of the user to get the car deal check valuation data documents
        
        Returns:
            list[DealCheckData]: The list of car deal check valuation data instances for the user
        '''
        
        if not userId:
            raise Exception('Missing user ID!')
        
        collectionRef: CollectionReference = getCollectionRef(collection=CAR_DEALCHECK_FEATURE)
        query: Query = collectionRef.where(filter=FieldFilter('userId', '==', userId))
        
        # Get query results and convert them to DealCheckDataObjects
        documents: list[dict] = getQueryResults(query)
        return map(DealCheckData.from_dict, documents)
    
    async def updateDealCheckData(self, dealCheck: DealCheckData) -> DealCheckData:
        '''
        Updates the information of a car deal check valuation data document in the database
        
        Args:
            dealCheck (DealCheckData): The car deal check valuation data containing the new data and document id
        
        Returns:
            DealCheckData: The updated car deal check valuation data instance
        '''
        
        if not dealCheck:
            raise Exception('Missing deal check data!')
        
        id: str = dealCheck.getId()
        data: dict = dealCheck.to_dict()
        
        # Send request to update the document in firestore database
        updateData: dict = updateDocument(collection=CAR_DEALCHECK_FEATURE, id=id, data=data)
        return DealCheckData.from_dict(data=updateData)
    
    async def deleteDealCheckData(self, id: str) -> bool:
        '''
        Deletes a car deal check valuation data document from the database
        
        Args:
            id (str): The id of the car deal check valuation data document to delete
        
        Returns:
            bool: True once the document is deleted
        '''
        
        if not id:
            raise Exception("Missing car deal valuation data document Id!")
        
        deleteDocument(collection=CAR_DEALCHECK_FEATURE, id=id)
        return True
    
    def addDealCheckData(self, dealCheck: DealCheckData) -> DealCheckData:
        '''
        Adds a car deal check valuation data document to the database
        
        Args:
            dealCheck (DealCheckData): The car deal check valuation data document instance containing the data of the document to create.
        
        Returns:
            DealCheckData: The instance created in the database, with the document id
        '''
        
        if not dealCheck:
            raise Exception('Missing deal check valuation data!')
        
        data: dict = dealCheck.to_dict()
        dealCheckData: dict = createDocument(collection=CAR_DEALCHECK_FEATURE, data=data)
        return DealCheckData.from_dict(dealCheckData)
    
INSTANCE: DealCheckDAO = DealCheckDAO()