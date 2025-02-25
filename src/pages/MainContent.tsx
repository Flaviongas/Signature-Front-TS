import { Center, Grid, GridItem } from "@chakra-ui/react";
import React, { useState } from "react";
import SideNav from "../components/SideNav";
import Dashboard from "../components/Dashboard";

type Props = {};

function MainContent({}: Props) {
  const [selectedCarrera, setSelectedCarrera] = useState<string>("");
  return (
    <Grid
      templateAreas={`"header header"
        "nav main"
        `}
      gridTemplateRows={"60px 1fr "}
      gridTemplateColumns={{ sm: `0 1fr`, md: `250px 1fr` }}
      fontSize={14}
    >
      <GridItem
        boxShadow="lg"
        zIndex="1"
        pos="sticky"
        top="0"
        pt="7px"
        bg="red.600"
        area={"header"}
        textAlign="center"
      >
        Signature
      </GridItem>
      <GridItem
        pos="sticky"
        top="60px"
        left={0}
        p="5"
        area={"nav"}
        height="calc(100vh - 60px)"
        overflowY="auto"
        bg="gray.800"
        color="gray.50"
      >
        <SideNav onSelectCarrera={setSelectedCarrera} />
      </GridItem>
      <GridItem p="4" bg="gray.100" area={"main"}>
        <Dashboard carrera={selectedCarrera} />
      </GridItem>
    </Grid>
  );
}

export default MainContent;
