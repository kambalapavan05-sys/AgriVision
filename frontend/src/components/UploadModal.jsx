import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Check,
  Loader2,
  Database,
} from 'lucide-react';
import { api } from '../services/api';
import { formatYield, formatProduction, formatArea } from '../utils/formatters';

export const UploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successResult, setSuccessResult] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setValidationResult(null);
    setErrorMessage(null);
    setSuccessResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelection = async (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.txt')) {
      setErrorMessage('Please select a valid CSV file (.csv).');
      return;
    }

    setFile(selectedFile);
    setErrorMessage(null);
    setValidationResult(null);
    setSuccessResult(null);
    setIsValidating(true);

    try {
      const res = await api.validateCsv(selectedFile);
      setValidationResult(res);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || 'An error occurred while validating the CSV file.'
      );
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleCommit = async () => {
    if (!file) return;
    setIsCommitting(true);
    setErrorMessage(null);

    try {
      const res = await api.commitCsv(file);
      setSuccessResult(res);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || 'Failed to ingest records into database.'
      );
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl border border-emerald-700/50 bg-forest-950 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Import Agricultural Dataset</h3>
              <p className="text-xs text-slate-400">
                Upload historical crop metrics in CSV format with automatic validation
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-forest-900 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success view */}
        {successResult ? (
          <div className="space-y-5 text-center py-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Ingestion Complete</h4>
              <p className="text-sm text-emerald-300">{successResult.message}</p>
              <p className="text-xs text-slate-400">
                Total records currently available in SQLite: {successResult.total_db_records.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={resetState}
                className="rounded-xl border border-emerald-700/50 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-forest-900"
              >
                Upload Another File
              </button>
              <button
                onClick={handleClose}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-forest-950 hover:bg-emerald-500 shadow-md shadow-emerald-950/40"
              >
                View Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Template download callout */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-800/40 bg-forest-900/40 p-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span>Need the standard CSV format? Required headers: state, district, crop, crop_year, season, area_hectares, production_tonnes, rainfall_mm</span>
              </div>
              <a
                href={api.getSampleTemplateUrl()}
                download
                className="flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 shrink-0 ml-3 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Sample CSV</span>
              </a>
            </div>

            {/* Drag & drop upload area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-950/40'
                  : 'border-emerald-800/50 bg-forest-950/60 hover:border-emerald-600 hover:bg-forest-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileSelection(e.target.files?.[0])}
              />
              <UploadCloud className="mx-auto h-10 w-10 text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-slate-200">
                {file ? file.name : 'Click to browse or drag and drop your CSV file here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports UTF-8 encoded CSV files up to 25MB
              </p>
            </div>

            {/* Loading validation indicator */}
            {isValidating && (
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-emerald-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Parsing schema and checking row data validity...</span>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                <div>{errorMessage}</div>
              </div>
            )}

            {/* Validation Feedback & Preview */}
            {validationResult && (
              <div className="space-y-4">
                {/* Stats badge */}
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-900/40 bg-forest-900/60 p-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    {validationResult.valid ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="font-bold text-white">
                      Status: {validationResult.valid ? 'Valid Schema' : 'Validation Issues Detected'}
                    </span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span>
                    Valid Rows:{' '}
                    <strong className="text-emerald-300 font-mono">
                      {validationResult.valid_rows_count}
                    </strong>
                  </span>
                  {validationResult.invalid_rows_count > 0 && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span>
                        Invalid Rows:{' '}
                        <strong className="text-rose-400 font-mono">
                          {validationResult.invalid_rows_count}
                        </strong>
                      </span>
                    </>
                  )}
                </div>

                {/* Validation errors list if any */}
                {validationResult.errors && validationResult.errors.length > 0 && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs space-y-2 max-h-40 overflow-y-auto">
                    <span className="font-bold text-amber-300 block">
                      Errors ({validationResult.errors.length}):
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {validationResult.errors.map((err, i) => (
                        <li key={i} className="font-mono text-[11px]">
                          Row {err.row_number}: <strong className="text-amber-400">{err.field}</strong> - {err.message} {err.value ? `(received "${err.value}")` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preview of first 5 valid rows */}
                {validationResult.preview && validationResult.preview.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-300">
                      Preview (First {validationResult.preview.length} rows with calculated yield):
                    </span>
                    <div className="overflow-x-auto rounded-xl border border-emerald-900/40">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-forest-900/70 text-slate-300">
                          <tr>
                            <th className="px-3 py-2">State</th>
                            <th className="px-3 py-2">District</th>
                            <th className="px-3 py-2">Crop</th>
                            <th className="px-3 py-2">Year</th>
                            <th className="px-3 py-2 text-right">Area (Ha)</th>
                            <th className="px-3 py-2 text-right">Production (MT)</th>
                            <th className="px-3 py-2 text-right">Yield (MT/Ha)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-950 text-slate-200">
                          {validationResult.preview.slice(0, 5).map((row, i) => (
                            <tr key={i} className="hover:bg-forest-900/40">
                              <td className="px-3 py-1.5 font-medium">{row.state}</td>
                              <td className="px-3 py-1.5">{row.district}</td>
                              <td className="px-3 py-1.5 text-emerald-300">{row.crop}</td>
                              <td className="px-3 py-1.5 font-mono">{row.crop_year}</td>
                              <td className="px-3 py-1.5 text-right font-mono">{formatArea(row.area_hectares)}</td>
                              <td className="px-3 py-1.5 text-right font-mono text-amber-300">{formatProduction(row.production_tonnes)}</td>
                              <td className="px-3 py-1.5 text-right font-mono text-teal-300 font-bold">{formatYield(row.yield_tonnes_per_ha)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Commit button */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleClose}
                    className="rounded-xl border border-emerald-800/40 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-forest-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCommit}
                    disabled={validationResult.valid_rows_count === 0 || isCommitting}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-forest-950 hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-md shadow-emerald-950/40"
                  >
                    {isCommitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Ingesting...</span>
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4" />
                        <span>Ingest {validationResult.valid_rows_count} Records</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
