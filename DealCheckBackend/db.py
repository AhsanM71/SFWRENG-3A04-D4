from FirebaseConfig import db
from google.cloud.firestore_v1.async_collection import AsyncCollectionReference
from google.cloud.firestore_v1.async_document import AsyncDocumentReference
from google.cloud.firestore_v1.base_document import DocumentSnapshot
from google.cloud.firestore_v1.async_query import AsyncQuery

CARS_COLLECTION = 'Cars'

def getDocumentRefPath(collection: str, id: str) -> str:
    '''
    Creates the path to a document that can be used as a reference in another document

    Args:
        collection (str): The name of the collection
        id (str): The id of the document

    Returns:
        str: The reference to the document /collection/id
    '''

    return '/{collection}/{id}'.format(collection=collection, id=id)

async def createDocument(collection: str, data: dict) -> str:
    '''
    Creates a document in the firestore database given a collection name and data

    Args:
        collection (str): The name of the collection to add the document to
        data (dict): The data of the new document

    Returns:
        str: The id of the new document
    '''

    collectionRef: AsyncCollectionReference = getCollectionRef(collection)
    _, docRef = await collectionRef.add(data)

    data: dict = docRef.to_dict()
    data['id'] = docRef.id

    return data

async def getDocument(collection: str, id: str) -> dict:
    '''
    Retrieves a document from a certain collection given its id

    Args:
        collection (str): The name of the collection to get the document from
        id (str): The id of the document to retrieve

    Returns:
        dict: The dictionary containing the data of the document

    Raises:
        Exception: If the document does not exist
    '''

    collectionRef: AsyncCollectionReference = getCollectionRef(collection)
    docRef: AsyncDocumentReference = collectionRef.document(id)
    docSnap: DocumentSnapshot = await docRef.get()

    if not docSnap.exists:
        raise Exception('Could not find a document with the reference {collection}/{id}'.format(collection=collection, id=id))
    
    data: dict = docSnap.to_dict()
    data['id'] = docSnap.id

    return data

def getCollectionRef(collection: str) -> AsyncCollectionReference:
    '''
    Gets a reference to a collection

    Args:
        collection (str): The name of the collection

    Returns:
        AsyncCollectionReference: The reference to the collection
    '''

    return db.collection(collection).where()

def getDocRef(collection: str, id: str) -> AsyncDocumentReference:
    '''
    Gets a reference to a document given its collection and id

    Args:
        collection (str): The name of the collection
        id (str): The id of the document to get a reference for

    Returns:
        AsyncDocumentReference: The reference to the document
    '''

    collectionRef: AsyncCollectionReference = getCollectionRef(collection)
    docRef: AsyncDocumentReference = collectionRef.document(id)
    return docRef

async def getQueryResults(query: AsyncQuery) -> list[any]:
    '''
    Gets the results of a query

    Args:
        query (AsyncQuery): The query to run

    Returns:
        list[dict]: A list of dictionaries containing the data of each document in the format { 'id': id, ...rest of the data here }
    '''

    queryResults: list[DocumentSnapshot] = await query.get()
    
    result = []

    for doc in queryResults:
        data: dict = doc.to_dict()
        data['id'] = doc.id
        result.append(data)

    return result

async def deleteDocument(collection: str, id: str):
    '''
    Deletes a document with a certain id from a collection

    Args:
        collection (str): The name of the collection
        id (str): The id of the document
    '''

    docRef: AsyncDocumentReference = getDocRef(collection, id)
    await docRef.delete()

async def updateDocument(collection: str, id: str, data: dict) -> dict:
    '''
    Updates a documents field given its collection and id, with the fields within the data dictionary

    Args:
        collection (str): The name of the collection the document is in
        id (str): The id of the document to update
        data (dict): The data fields to update/set in the document

    Returns:
        dict: The data of the updated document in the format { 'id': id, ...rest of the data }
    '''
    
    docRef: AsyncDocumentReference = getDocRef(collection, id)
    _, updatedDocRef = await docRef.set(data)
    
    data: dict = updatedDocRef.to_dict()
    data['id'] = updatedDocRef.id

    return data