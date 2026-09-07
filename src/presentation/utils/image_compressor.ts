/**
 * Image Compression Utility
 * Resizes and compresses payment proof images locally before upload
 */

import * as ImageManipulator from 'expo-image-manipulator';

export interface CompressedImageResult {
  uri: string;
  width: number;
  height: number;
}

export const compressPaymentProof = async (
  uri: string
): Promise<CompressedImageResult> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }], // Resize max width to 1200px while maintaining aspect ratio
      {
        compress: 0.7, // 70% JPEG quality
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return {
      uri: manipResult.uri,
      width: manipResult.width,
      height: manipResult.height,
    };
  } catch (error) {
    console.warn('Image manipulation failed, using original uri:', error);
    return {
      uri,
      width: 0,
      height: 0,
    };
  }
};
