export default {
  async search(query) {
    if (!query || query.length < 3) {
      return [];
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'QuikTrakApp/1.0' 
          }
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      
      return data.map(item => ({
        label: item.display_name,
        x: parseFloat(item.lon),
        y: parseFloat(item.lat),
        bounds: item.boundingbox ? [
          [parseFloat(item.boundingbox[0]), parseFloat(item.boundingbox[2])],
          [parseFloat(item.boundingbox[1]), parseFloat(item.boundingbox[3])]
        ] : null
      }));
    } catch (error) {
      console.error('Nominatim search error:', error);
      throw error;
    }
  }
};