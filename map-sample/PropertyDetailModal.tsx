'use client';

import { Building as BuildingIcon, X, Maximize, MapPin, CheckCircle, BarChart, DollarSign, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { classificationColors } from './Map';
import { formatCurrency } from '@/lib/utils';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building | null;
}

export function PropertyDetailModal({ isOpen, onClose, building }: PropertyDetailModalProps) {
  if (!building) return null;

  const { id, properties, geometry } = building;
  const { 
    classification, 
    area_in_meters, 
    confidence, 
    estimatedValue, 
    detectedAt 
  } = properties;
  
  const classificationColor = classificationColors[classification] || classificationColors.default;
  const confidencePercent = Math.round(confidence * 100);
  let confidenceColorClass = 'text-yellow-500';
  if (confidencePercent >= 90) confidenceColorClass = 'text-green-500';
  else if (confidencePercent >= 70) confidenceColorClass = 'text-blue-500';

  const center = geometry.coordinates[0].reduce((acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]], [0, 0]);
  center[0] /= geometry.coordinates[0].length;
  center[1] /= geometry.coordinates[0].length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                         <BuildingIcon className="w-6 h-6 text-gray-600" />
                     </div>
                     <div>
                        <Badge style={{ backgroundColor: classificationColor }} className="text-white capitalize mb-1">{classification}</Badge>
                        <h2 className="text-xl font-bold text-gray-800">Property Details</h2>
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-mono">{id}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full -mr-2 -mt-2">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <Separator />
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Maximize className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-gray-500">Area</p>
                        <p className="font-bold text-gray-800 text-base">{area_in_meters.toFixed(2)} m²</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-gray-500">Coordinates</p>
                        <p className="font-bold text-gray-800 text-base">{center[1].toFixed(4)}, {center[0].toFixed(4)}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-gray-500">Confidence</p>
                        <p className={`font-bold text-base ${confidenceColorClass}`}>{confidencePercent}%</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-gray-500">Estimated Value</p>
                        <p className="font-bold text-gray-800 text-base">{formatCurrency(estimatedValue)}</p>
                    </div>
                </div>
              </div>

              <Separator className="my-6" />

               <div>
                 <h3 className="text-base font-semibold text-gray-800 mb-3">Detection Metadata</h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-500">Source:</span>
                     <span className="font-medium text-gray-700">Satellite Imagery</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500">Method:</span>
                     <span className="font-medium text-gray-700">AI Computer Vision</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500">Detected On:</span>
                     <span className="font-medium text-gray-700">{detectedAt}</span>
                   </div>
                 </div>
               </div>

            </div>

             <div className="p-6 bg-gray-50 border-t">
                <div className="flex gap-3">
                    <Button className="w-full">View Full Report</Button>
                    <Button variant="outline" className="w-full">Flag for Review</Button>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
