import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
type Props = {};

function SubjectsGrid({}: Props) {
  return (
    <SimpleGrid columns={2} spacing={10}>
      <Box bg="tomato" height="80px"></Box>
    </SimpleGrid>
  );
}

export default SubjectsGrid;
