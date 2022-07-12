package cn.cnic.schedule;

import cn.cnic.base.utils.LoggerUtil;
import cn.cnic.base.utils.SpringContextUtil;
import cn.cnic.base.utils.ThreadPoolExecutorUtils;
import cn.cnic.common.constant.SysParamsCache;
import cn.cnic.common.executor.ServicesExecutor;
import cn.cnic.component.process.domain.ProcessDomain;
import cn.cnic.component.process.mapper.ProcessMapper;
import cn.cnic.third.service.IFlow;

import org.apache.commons.collections.CollectionUtils;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


@Component
public class RunningProcessSync extends QuartzJobBean {

	/**
     * Introducing logs, note that they are all packaged under "org.slf4j"
     */
    private Logger logger = LoggerUtil.getLogger();

    private final ProcessDomain processDomain;

    @Autowired
    public RunningProcessSync(ProcessDomain processDomain) {
        this.processDomain = processDomain;
    }

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss:SSS");
        logger.info("processSync start : " + formatter.format(new Date()));
        List<String> runningProcess = processDomain.getRunningProcessAppId();
        if (CollectionUtils.isNotEmpty(runningProcess)) {
            if (null == SysParamsCache.MONITOR_THREAD_POOL_EXECUTOR) {
                SysParamsCache.MONITOR_THREAD_POOL_EXECUTOR = ThreadPoolExecutorUtils.createThreadPoolExecutor(1, 5, 0L);;
            }
            for (String appId : runningProcess) {
                SysParamsCache.MONITOR_THREAD_POOL_EXECUTOR.execute(() -> {
                    try {
                        IFlow getFlowInfoImpl = (IFlow) SpringContextUtil.getBean("flowImpl");
                        getFlowInfoImpl.getProcessInfoAndSave(appId);
                    } catch (Exception e) {
                        logger.error("update process data error", e);
                    }
                });
            }
        }
        logger.info("processSync end : " + formatter.format(new Date()));
    }
}