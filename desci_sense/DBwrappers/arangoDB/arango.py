from arango import ArangoClient
import base64
import os
#import sys
#from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

#sys.path.append(str(Path(__file__).parents[3]))


class ArangoDB:
    def __init__(self):

        password = os.environ.get("ARANGO_PASS")
        username = os.environ.get("ARANGO_USER_NAME")
        encodedCA = "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUMrakNDQWVLZ0F3SUJBZ0lSQU5WbkJBNG04MGFac0tXVnhtRVZCZXd3RFFZSktvWklodmNOQVFFTEJRQXcKSmpFUk1BOEdBMVVFQ2hNSVFYSmhibWR2UkVJeEVUQVBCZ05WQkFNVENFRnlZVzVuYjBSQ01CNFhEVEl3TVRFeQpPREUxTURBeU5Wb1hEVEkxTVRFeU56RTFNREF5TlZvd0pqRVJNQThHQTFVRUNoTUlRWEpoYm1kdlJFSXhFVEFQCkJnTlZCQU1UQ0VGeVlXNW5iMFJDTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEKemFRS2JwWnh5SWFMK0YyV1BzU3ZlWStCMlNDVzlPbXpacFMzUmk5a1N3VTUzeWJYeUd4RHRLcXhWZytzTFZIUwo5MzlXSlpDenRNUkFQeCtWRUN3aEF3VEhLNmsvUlJJOTFzMkFnb2ExYUNDS1dhMm9KKzFVSmYyRzZaL01iVzVhCjBVblRzZ250Ukt2T3k1N1l1dFUrRm51V3FuN3plYklNWXFjWVpWWEppcUtBZkw0emhMSEFnN3FlMFFzalo0eVQKVFZSS1N5a0cvdjdOY2EzVmoxNWpqbXJQYWhybjBSZkVaWnJjN1F0K2JPVDhsM3dpdUk0NFJjQ0RTTnRFSzlweAphTjRSOU1LWW45YnNWSDJsQlFuclVBZTMxeXZOb0xSM3pFcnFMZVE2WXZBcHllblorV09ScFEyZXpveFA5eW84ClVsMm9vWkgwRHRYSmttN0hhV1BaYXdJREFRQUJveU13SVRBT0JnTlZIUThCQWY4RUJBTUNBcVF3RHdZRFZSMFQKQVFIL0JBVXdBd0VCL3pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQXhSOWw2NURZemhkeXE2R2NOd094cGR1UwpZRm44clRWeHpPRlRsRHVyNmgyaHR3emVNVG5YYzRqRmptR2ttS1Jha3dqUWVaN0owRDBwbm54WnBHK2VLN1d0ClVvNEdoMXFYVlNDcDlOdzhrWnRNZ0JGbnB1TmFHVGlDZUZraVMzWk14R2trTUpUYUtqbjBtSGgvbDYxUWZZWW4KOEZTMTFMZHQ3SE5DOGlHQXNWTWtDL0JJQk5pQ29XM0E1WUJtcmROVVVyeVBzdGJQdTZnN3dSOEhrM1RCbmlubAptcWJUMHd5bXVJNkx3YjdlbGF4Z2dIWWlPamg3OXpUaWZJUWEvZjBjRTJFSnBFMkROWGRCbHB3c1dXMTdsOUtDCmVTOVVoYUI1MkFSN2VaU25oaXlsVjFLUkxCeTBZa3RJQ1ZvNzZHckJZZE5Ma1ZseEdGZ3ByRVpQQTdVSWt3PT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo="
        try:
            file_content = base64.b64decode(encodedCA)
            with open("cert_file.crt", "w+") as f:
                f.write(file_content.decode("utf-8"))
        except Exception as e:
            print(str(e))
            exit(1)

        client = ArangoClient(
            hosts="https://8002ef9dab5a.arangodb.cloud:18529", verify_override="cert_file.crt"
        )

        db = client.db("sense_networks", username="shahar", password=password)
        self.db = db
        
    def insert(self,doc):
        
        self.db.collection("test").insert(doc)
        
        
#instance = arango_db().db

#instance.collection("test").insert({"test":2})

