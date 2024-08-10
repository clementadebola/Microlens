import React from "react";
import styled from "styled-components";
import { MicroorganismInfo } from "./types";
import { parseMicroorganismInfo } from "./utils";


const MContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
`;

const MInfoList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MInfoItem = styled.li`
  margin-bottom: 15px;
`;

const MLabel = styled.span`
  font-weight: bold;
  color: #d8d8d8;
  font-size:13px;
`;

const MValue = styled.span`
  margin-left: 5px;
  color:#fff;
  font-size:13px;
`;

const MicroorganismDetails: React.FC<{ info: Partial<MicroorganismInfo> }> = ({
  info,
}) => {
  return (
    <MContainer>
  <MInfoList>
    <MInfoItem>
      <MLabel>Name:</MLabel>
      <MValue>{info?.name || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Species:</MLabel>
      <MValue>{info?.species || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Domain:</MLabel>
      <MValue>{info?.domain || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Disease(s):</MLabel>
      <MValue>{info?.diseases || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Transmission:</MLabel>
      <MValue>{info?.transmission || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Diagnosis:</MLabel>
      <MValue>{info?.diagnosis || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Symptoms:</MLabel>
      <MValue>{info?.symptoms || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Treatment:</MLabel>
      <MValue>{info?.treatment || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Prevention:</MLabel>
      <MValue>{info?.prevention || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Habitat:</MLabel>
      <MValue>{info?.habitat || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Morphology:</MLabel>
      <MValue>{info?.morphology || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Size:</MLabel>
      <MValue>{info?.size || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Elevation:</MLabel>
      <MValue>{info?.elevation || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Shape:</MLabel>
      <MValue>{info?.shape || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Oxygen Requirement:</MLabel>
      <MValue>{info?.oxygenRequirement || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Growth Temperature:</MLabel>
      <MValue>{info?.growthTemperature || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Colony Characteristics:</MLabel>
      <MValue>{info?.colonyCharacteristics || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Virulence Factors:</MLabel>
      <MValue>{info?.virulenceFactors || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Genome Size:</MLabel>
      <MValue>{info?.genomeSize || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>GC Content:</MLabel>
      <MValue>{info?.gcContent || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Replication:</MLabel>
      <MValue>{info?.replication || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Motility:</MLabel>
      <MValue>{info?.motility || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Biochemical Tests:</MLabel>
      <MValue>{info?.biochemicalTests || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Environmental Resistance:</MLabel>
      <MValue>{info?.environmentalResistance || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Public Health Impact:</MLabel>
      <MValue>{info?.publicHealthImpact || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
      <MLabel>Isolation Sources:</MLabel>
      <MValue>{info?.isolationSources || 'N/A'}</MValue>
    </MInfoItem>
    <MInfoItem>
    <MInfoItem>
      <MLabel>Antibiotic Resistance:</MLabel>
      <MValue>{info?.antibioticResistance || 'N/A'}</MValue>
    </MInfoItem>
      <MLabel>Sensitivity:</MLabel>
      <MValue>{info?.antibioticSensitivity || 'N/A'}</MValue>
    </MInfoItem>
  </MInfoList>
</MContainer>

  );
};

const OrganismDetails = ({res}:{res: string}) => {

  const microorganismInfo: Partial<MicroorganismInfo> = parseMicroorganismInfo(res);
  return <MicroorganismDetails info={microorganismInfo} />;
};

export default OrganismDetails;
