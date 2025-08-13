import math

def clean_floats(obj):
    if isinstance(obj, float):
        if math.isfinite(obj):
            return obj
        else:
            return None
    elif isinstance(obj, dict):
        return {k: clean_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_floats(v) for v in obj]
    else:
        return obj
