import os

def directory_path(file_name):
    """Returning directory path for another file in the main program files's folder"""
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), file_name)