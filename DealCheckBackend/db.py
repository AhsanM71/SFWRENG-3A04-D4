from FirebaseConfig import db
from firebase_admin.firestore import CollectionReference, DocumentReference, DocumentSnapshot, Query, FieldFilter

CARS_COLLECTION = 'Cars'
CAR_RECOMMENDATION_COLLECTION='CarRecommendationInformation'
CAR_DEALCHECK_FEATURE = 'CarDealCheckFeature'

def resolve_references(data: dict) -> dict:
    '''
    Recursively resolves all DocumentReferences in a Firestore document

    Args:
        data (dict): The dictionary data of the document

    Returns:
        dict: The full dictionary of the data of the document
    '''
    for key, value in data.items():
        if isinstance(value, DocumentReference):
            snapshot = value.get()
            nested_data = snapshot.to_dict()
            nested_data['id'] = snapshot.id
            if nested_data:
                data[key] = resolve_references(nested_data)
            else:
                data[key] = None 
    return data

def getDocumentReference(collection, id) -> DocumentReference:
    '''
    Creates a document with the path to a document that can be used as a reference in another document

    Args:
        collection (str): The name of the collection
        id (str): The id of the document

    Returns:
        str: The reference to the document /collection/id
    '''
    return db.collection(collection).document(id)

def createDocument(collection: str, data: dict) -> dict:
    '''
    Creates a document in the Firestore database given a collection name and data.

    Args:
        collection (str): The name of the collection to add the document to.
        data (dict): The data of the new document.

    Returns:
        dict: The data of the newly created document, including its ID.
    '''
    collectionRef: CollectionReference = getCollectionRef(collection)
    _, docRef = collectionRef.add(data)
    
    # Fetch the document snapshot to retrieve its data
    docSnap: DocumentSnapshot = docRef.get()
    if not docSnap.exists:
        raise Exception(f"Failed to retrieve the created document in collection '{collection}'")
    
    # Resolve references and include the document ID
    resolved_data: dict = resolve_references(docSnap.to_dict())
    resolved_data['id'] = docSnap.id
    return resolved_data

def getDocument(collection: str, id: str) -> dict:
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

    collectionRef: CollectionReference = getCollectionRef(collection)
    docRef: DocumentReference = collectionRef.document(id)
    docSnap: DocumentSnapshot = docRef.get()

    if not docSnap.exists:
        raise Exception('Could not find a document with the reference {collection}/{id}'.format(collection=collection, id=id))
    
    data: dict = resolve_references(docSnap.to_dict())
    data['id'] = docSnap.id

    return data

def getCollectionRef(collection: str) -> CollectionReference:
    '''
    Gets a reference to a collection

    Args:
        collection (str): The name of the collection

    Returns:
        CollectionReference: The reference to the collection
    '''

    return db.collection(collection)

def getDocRef(collection: str, id: str) -> DocumentReference:
    '''
    Gets a reference to a document given its collection and id

    Args:
        collection (str): The name of the collection
        id (str): The id of the document to get a reference for

    Returns:
        DocumentReference: The reference to the document
    '''

    collectionRef: CollectionReference = getCollectionRef(collection)
    docRef: DocumentReference = collectionRef.document(id)
    return docRef

def getQueryResults(query: Query) -> list[any]:
    '''
    Gets the results of a query

    Args:
        query (Query): The query to run

    Returns:
        list[dict]: A list of dictionaries containing the data of each document in the format { 'id': id, ...rest of the data here }
    '''
    queryResults: list[DocumentSnapshot] = query.get()
    result = []
    for doc in queryResults:
        data: dict = resolve_references(doc.to_dict())
        data['id'] = doc.id
        result.append(data)
    return result

def deleteDocument(collection: str, id: str):
    '''
    Deletes a document with a certain id from a collection

    Args:
        collection (str): The name of the collection
        id (str): The id of the document
    '''

    docRef: DocumentReference = getDocRef(collection, id)
    docRef.delete()

def updateDocument(collection: str, id: str, data: dict) -> dict:
    '''
    Updates a documents field given its collection and id, with the fields within the data dictionary

    Args:
        collection (str): The name of the collection the document is in
        id (str): The id of the document to update
        data (dict): The data fields to update/set in the document

    Returns:
        dict: The data of the updated document in the format { 'id': id, ...rest of the data }
    '''
    
    docRef: DocumentReference = getDocRef(collection, id)
    _, updatedDocRef = docRef.set(data)
    
    data: dict = resolve_references(updatedDocRef.to_dict())
    data['id'] = updatedDocRef.id

    return data