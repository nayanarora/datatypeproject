from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import read_and_infer_data_types


class InferDataTypesView(APIView):
    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            dataframe = read_and_infer_data_types(file_obj)
            dataframe_dtypes_str = {column: str(dtype) for column, dtype in dataframe.dtypes.items()}
            return Response(dataframe_dtypes_str, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from .models import read_and_infer_data_types
# import pandas as pd

# class InferDataTypesView(APIView):
#     def post(self, request):
#         file_obj = request.FILES.get('file')
#         if not file_obj:
#             return Response({'error': 'File not provided'}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             dataframe_dtypes_str, first_five_rows = read_and_infer_data_types(file_obj)
#             # Store the file temporarily or in session if modifications need to be saved later
#             return Response({
#                 'data_types': dataframe_dtypes_str,
#                 'preview_rows': first_five_rows
#             }, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# class SaveModifiedCSV(APIView):
#     def post(self, request):
#         modified_data_types = request.data.get('modifiedDataTypes')
#         # Implement logic to open the previously uploaded file, apply changes, and save
#         # This step is highly dependent on your application's logic and storage
#         # For demonstration, assume 'uploaded_file.csv' is the file to modify and save
#         try:
#             df = pd.read_csv('path/to/temporary/uploaded_file.csv')
#             # Apply the modified data types to the DataFrame
#             # This is a simplified example; actual implementation may vary
#             for column, dtype in modified_data_types.items():
#                 df[column] = df[column].astype(dtype)
#             df.to_csv('path/to/save/modified_file.csv', index=False)
#             return Response({'message': 'CSV saved successfully'}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
