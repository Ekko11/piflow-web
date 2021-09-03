package cn.cnic.component.process.service;

import cn.cnic.ApplicationTests;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class IProcessServiceTest extends ApplicationTests {

    @Autowired
    private IProcessService processServiceImpl;

    @Test
    public void testFlowToProcessAndSave() {
        try {
            processServiceImpl.flowToProcessAndSave(true, "admin", "d97aa10691db4b8da2680cb5b56a7ea0");
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    @Test
    public void testLineChartVisualizationData() {
        String result = processServiceImpl.getVisualizationData("application_1596710850427_0039", "LineChart8", "LINECHART", true);
        System.out.println(result);
    }

    @Test
    public void testPieChartVisualizationData() {
        String result = processServiceImpl.getVisualizationData("application_1596710850427_0413", "PieChart", "PIECHART", true);
        System.out.println(result);
    }

    @Test
    public void testHistogramVisualizationData() {
        String result = processServiceImpl.getVisualizationData("application_1596710850427_4294", "Histogram", "HISTOGRAM", true);
        System.out.println(result);
    }

}