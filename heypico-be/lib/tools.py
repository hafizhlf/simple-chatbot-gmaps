from lib import env
from lib import types as my_types

def find_place_on_map(query: str) -> my_types.ResponseModel:
    """
    Generate a Google Maps embedded link and URL for a given place query.

    Parameters:
        query (str): A location or place the user is searching for.

    Returns:
        ResponseModel: Includes the embedded HTML iframe and a direct link.
    """
    if not query.strip():
        raise ValueError("Query cannot be empty.")

    # Sanitize query
    encoded_query = query.strip().replace(" ", "+")

    # Get Google Maps API Key
    api_key = env.GOOGLE_MAPS_API_KEY

    # Create embedded iframe and map link
    embedded_url = f"https://www.google.com/maps/embed/v1/search?key={api_key}&q={encoded_query}"

    output_data = f'<iframe width="600" height="450" style="border:0" loading="lazy" allowfullscreen src="{embedded_url}"></iframe>'

    return my_types.ResponseModel(
        status="success",
        data=my_types.DataModel(output=output_data)
    )
