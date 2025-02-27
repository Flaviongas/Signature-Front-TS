import { Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import SideNav from "../components/SideNav";
import Dashboard from "../components/Dashboard";
import { MajorShort } from "../types";

type Props = {};

function MainContent({}: Props) {
  const [selectedMajors, setSelectedMajors] = useState<MajorShort>({
    id: 0,
    name: "",
  });
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
        <SideNav onSelectMajors={setSelectedMajors} />
      </GridItem>
      <GridItem p="4" bg="gray.100" area={"main"}>
        <Dashboard majors={selectedMajors} />
      </GridItem>
    </Grid>
  );
}

export default MainContent;
