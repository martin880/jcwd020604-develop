'use client'

import { Box, Heading, Text } from '@chakra-ui/react';

export default function OrderNotFound() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text">
        204
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        No Content
      </Text>
      <Text color={'gray.500'} mb={6}>
        There is no order right now
      </Text>
    </Box>
  )
}