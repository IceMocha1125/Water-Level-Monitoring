import React from 'react';
import { 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FAQ() {
  const faqItems = [
    {
      question: "What do the different water level alerts mean?",
      answer: `• Normal (Green): Water level is within safe limits
• Warning (Yellow): Water level is rising but not critical
• Critical (Red): Water level has reached dangerous levels, evacuation may be necessary`
    },
    {
      question: "How often is the water level data updated?",
      answer: "The water level data is updated in real-time, with readings taken every 10 seconds from our sensors."
    },
    {
      question: "What should I do when I receive a critical alert?",
      answer: `1. Stay calm and alert
2. Monitor official announcements
3. Prepare emergency supplies
4. Contact local authorities if needed
5. Follow evacuation procedures if instructed`
    },
    {
      question: "Where are the evacuation centers located?",
      answer: `Primary evacuation centers in Balanga City:
• Cupang Elementary School
• Balanga City Sports Complex
• Balanga Elementary School
• City Multi-Purpose Hall`
    },
    {
      question: "How can I update my contact information?",
      answer: "You can update your contact information through the Residents section. Click on the edit button next to your name and update your details. This ensures you receive timely alerts and notifications."
    }
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Frequently Asked Questions (FAQ)
      </Typography>
      <Box sx={{ mt: 2 }}>
        {faqItems.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography style={{ whiteSpace: 'pre-line' }}>
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
}

export default FAQ; 