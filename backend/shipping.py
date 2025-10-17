def calculate_shipping_cost(country: str) -> float:
    """Calculate shipping cost based on country (ISO 2-letter code or name)"""

    # Normalize to uppercase
    country = country.upper().strip()

    # USA shipping
    if country in ['USA', 'UNITED STATES', 'US', 'UNITED STATES OF AMERICA']:
        return 10.00

    # Canada shipping
    elif country in ['CANADA', 'CA']:
        return 15.00

    # International shipping (everything else)
    else:
        return 20.00

def get_shipping_zones():
    """Return available shipping zones and costs"""
    return {
        'usa': {
            'name': 'United States',
            'cost': 10.00,
            'delivery_time': '3-5 business days'
        },
        'canada': {
            'name': 'Canada', 
            'cost': 15.00,
            'delivery_time': '5-7 business days'
        },
        'international': {
            'name': 'International',
            'cost': 20.00,
            'delivery_time': '7-14 business days'
        }
    }