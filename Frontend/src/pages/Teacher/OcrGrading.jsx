import React, { useState } from 'react';
import { ScanLine, Upload, Loader2, FileSignature, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '../../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:6868';

const OcrGrading = () => {
  const [formData, setFormData] = useState({
    exam_id: '',
    student_name: '',
    image_base64: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image_base64: reader.result.split(',')[1] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (mode) => {
    if (!formData.image_base64) {
      toast.error('Vui lòng tải ảnh lên.');
      return;
    }

    let payload = { image_base64: formData.image_base64 };
    let successMessage = '';

    if (mode === 'grade') {
      if (!formData.exam_id || !formData.student_name) {
        toast.error('Để chấm bài, vui lòng điền ID đề thi và tên học sinh.');
        return;
      }
      payload.exam_id = formData.exam_id;
      payload.student_name = formData.student_name;
      successMessage = 'Chấm bài thành công!';
    } else {
      successMessage = 'Trích xuất văn bản thành công!';
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await apiFetch(`${API_URL}/ocr/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        toast.success(data.message || successMessage);
        // Store mode in result to render UI correctly
        setResult({ ...data.data, mode });
      } else {
        throw new Error(data.message || 'Thao tác thất bại.');
      }
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><ScanLine className="mr-3" />Chấm bài bằng OCR</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Đề thi</label>
            <input type="number" name="exam_id" value={formData.exam_id} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên Học sinh</label>
            <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tải ảnh bài làm</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          {imagePreview && <img src={imagePreview} alt="Xem trước" className="mt-4 max-h-60 rounded-md border" />}
          <div className="flex space-x-3 pt-2">
            <button onClick={() => handleSubmit('grade')} disabled={loading} className="w-full flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
              {loading ? <Loader2 className="animate-spin" /> : <><FileSignature className="mr-2 h-5 w-5" /> Chấm bài</>}
            </button>
            <button onClick={() => handleSubmit('extract')} disabled={loading} className="w-full flex justify-center items-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400">
              {loading ? <Loader2 className="animate-spin" /> : <><Type className="mr-2 h-5 w-5" /> Lấy chữ</>}
            </button>
          </div>
        </div>
        {result && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-2">Kết quả</h3>
            {result.mode === 'grade' ? (
              <div className="space-y-1">
                <p><strong>Học sinh:</strong> {result.student_name}</p>
                <p><strong>Điểm số:</strong> <span className="font-bold text-xl text-green-600">{result.score}</span></p>
                <p><strong>ID Đề thi:</strong> {result.exam_id}</p>
                <p><strong>Thời gian xử lý:</strong> {new Date(result.processed_at).toLocaleString()}</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold mb-2">Văn bản trích xuất:</p>
                <pre className="whitespace-pre-wrap bg-white p-3 rounded text-sm border max-h-96 overflow-y-auto">{result.text}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OcrGrading;