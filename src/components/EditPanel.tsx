'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBentoStore } from '@/lib/store';
import { X, Palette, Move, Type, Link, Trash2 } from 'lucide-react';

const colorPresets = [
  '#ffffff', '#f5f5f5', '#000000', '#0d1117',
  '#ff0000', '#ff6b00', '#ffdd00', '#00ff00',
  '#00ffff', '#0066ff', '#6600ff', '#ff00ff',
];

export function EditPanel() {
  const {
    showEditPanel,
    setShowEditPanel,
    selectedCardId,
    cards,
    updateCardStyle,
    updateCardSize,
    removeCard,
    selectCard,
  } = useBentoStore();

  const selectedCard = cards.find((c) => c.id === selectedCardId);

  if (!selectedCard) return null;

  return (
    <AnimatePresence>
      {showEditPanel && (
        <motion.div
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          exit={{ x: 320 }}
          className="edit-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Edit Card</h3>
            <button
              onClick={() => {
                setShowEditPanel(false);
                selectCard(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Card Type */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Type
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm capitalize">
                {selectedCard.type}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center gap-2">
                <Move className="w-4 h-4" />
                Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { w: 1, h: 1, label: '1x1' },
                  { w: 2, h: 1, label: '2x1' },
                  { w: 2, h: 2, label: '2x2' },
                  { w: 3, h: 2, label: '3x2' },
                  { w: 4, h: 2, label: '4x2' },
                ].map(({ w, h, label }) => (
                  <button
                    key={label}
                    onClick={() => updateCardSize(selectedCard.id, { width: w, height: h })}
                    className={`
                      px-3 py-2 text-sm rounded-lg transition-colors
                      ${selectedCard.size.width === w && selectedCard.size.height === h
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Background
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateCardStyle(selectedCard.id, { backgroundColor: color })}
                    className={`
                      w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110
                      ${selectedCard.style?.backgroundColor === color
                        ? 'border-blue-500'
                        : 'border-gray-200'
                      }
                    `}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={selectedCard.style?.backgroundColor || '#ffffff'}
                onChange={(e) => updateCardStyle(selectedCard.id, { backgroundColor: e.target.value })}
                className="mt-2 w-full h-10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Text Color */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text Color
              </label>
              <div className="flex gap-2">
                {['#000000', '#ffffff', '#666666', '#3b82f6'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateCardStyle(selectedCard.id, { textColor: color })}
                    className={`
                      flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors
                      ${selectedCard.style?.textColor === color
                        ? 'border-blue-500'
                        : 'border-gray-200'
                      }
                    `}
                    style={{ backgroundColor: color, color: color === '#000000' ? '#fff' : '#000' }}
                  >
                    Aa
                  </button>
                ))}
              </div>
            </div>

            {/* Link (for link cards) */}
            {selectedCard.content.type === 'link' && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  URL
                </label>
                <input
                  type="url"
                  value={selectedCard.content.data.url}
                  onChange={(e) => {
                    // Would need to implement content update here
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>
            )}

            {/* Delete */}
            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  removeCard(selectedCard.id);
                  setShowEditPanel(false);
                  selectCard(null);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Card
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
