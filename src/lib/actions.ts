'use server'

import {
  processTextQuery,
  type ProcessTextQueryInput,
  type ProcessTextQueryOutput,
} from '@/ai/flows/process-text-query'
import {
  processImageQuery,
  type ProcessImageQueryInput,
  type ProcessImageQueryOutput,
} from '@/ai/flows/process-image-query'
import {
  processVoiceQuery,
  type ProcessVoiceQueryInput,
  type ProcessVoiceQueryOutput,
} from '@/ai/flows/process-voice-query'
import {
  processDocumentQuery,
  type ProcessDocumentQueryInput,
  type ProcessDocumentQueryOutput,
} from '@/ai/flows/process-document-query'

export async function getTextResponse(
  input: ProcessTextQueryInput
): Promise<ProcessTextQueryOutput> {
  try {
    const response = await processTextQuery(input)
    return response
  } catch (error) {
    console.error('Error processing text query:', error)
    return { answer: 'Sorry, I encountered an error. Please try again.' }
  }
}

export async function getImageResponse(
  input: ProcessImageQueryInput
): Promise<ProcessImageQueryOutput> {
  try {
    const response = await processImageQuery(input)
    return response
  } catch (error) {
    console.error('Error processing image query:', error)
    return { answer: 'Sorry, I encountered an error analyzing the image. Please try again.' }
  }
}

export async function getVoiceResponse(
  input: ProcessVoiceQueryInput
): Promise<ProcessVoiceQueryOutput> {
  try {
    const response = await processVoiceQuery(input)
    return response
  } catch (error) {
    console.error('Error processing voice query:', error)
    return { 
      textResponse: 'Sorry, I had trouble understanding you. Please try again.',
      audioResponse: ''
    }
  }
}

export async function getDocumentResponse(
  input: ProcessDocumentQueryInput
): Promise<ProcessDocumentQueryOutput> {
  try {
    const response = await processDocumentQuery(input);
    return response;
  } catch (error) {
    console.error('Error processing document query:', error);
    return { answer: 'Sorry, I encountered an error analyzing the document. Please try again.' };
  }
}
