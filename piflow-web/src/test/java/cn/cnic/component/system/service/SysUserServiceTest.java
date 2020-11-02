package cn.cnic.component.system.service;

import cn.cnic.ApplicationTests;
import cn.cnic.base.util.LoggerUtil;
import cn.cnic.base.util.UUIDUtils;
import cn.cnic.component.flow.entity.Flow;
import cn.cnic.component.flow.service.IFlowService;
import org.junit.Test;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

public class SysUserServiceTest extends ApplicationTests {

	@Autowired
	private ISysUserService sysUserServiceImpl;

	Logger logger = LoggerUtil.getLogger();

	@Test
	public void testGetFlowById() {
		String userName = sysUserServiceImpl.checkUserName("admin");
		logger.info(userName);
	}
}
